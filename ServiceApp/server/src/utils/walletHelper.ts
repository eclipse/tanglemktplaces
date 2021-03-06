/********************************************************************************
 * Copyright (c) 2020 Contributors to the Eclipse Foundation
 * 
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 * 
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 * 
 * SPDX-License-Identifier: Apache-2.0
 ********************************************************************************/


import { composeAPI, LoadBalancerSettings } from '@iota/client-load-balancer';
import { createPrepareTransfers, generateAddress } from '@iota/core';
import axios from 'axios';
import { depth, faucet, faucetAmount, minWeightMagnitude, security } from '../config.json';
import { ServiceFactory } from '../factories/serviceFactory';
import { readData, writeData } from './databaseHelper';
import { generateSeed } from './iotaHelper';
import { processPaymentQueue } from './paymentQueueHelper';

export const fundWallet = async () => {
    try {
        const userWallet: any = await readData('wallet');
        const response = await axios.get(`${faucet}?address=${userWallet.address}&amount=${faucetAmount}`);
        const data = response.data;
        if (data.success) {
            const balance = await getBalance(userWallet.address);
            await writeData('wallet', { ...userWallet, balance });
        }
    } catch (error) {
        console.log('fund wallet error', error);
        throw new Error('Wallet funding error. \n\nPlease contact industry@iota.org');
    }
};

export const generateNewWallet = () => {
    try {
        const seed = generateSeed();
        const address = generateAddress(seed, 0, security, true);
        return { seed, address, keyIndex: 0, balance: 0 };
    } catch (error) {
        console.error('generateNewWallet error', error);
        return {};
    }
};

export const getBalance = async address => {
    try {
        if (!address) {
            return 0;
        }
        const loadBalancerSettings = ServiceFactory.get<LoadBalancerSettings>('load-balancer-settings');
        const { getBalances } = composeAPI(loadBalancerSettings);
        const { balances } = await getBalances([address]);
        return balances && balances.length > 0 ? balances[0] : 0;
    } catch (error) {
        console.error('getBalance error', error);
        return 0;
    }
};

const transferFunds = async (wallet, totalAmount, transfers) => {
    try {
        const { address, keyIndex, seed } = wallet;
        const loadBalancerSettings = ServiceFactory.get<LoadBalancerSettings>('load-balancer-settings');
        const { getInclusionStates, sendTrytes } = composeAPI(loadBalancerSettings);
        const prepareTransfers = createPrepareTransfers();
        const balance = await getBalance(address);

        if (balance === 0) {
            console.error('transferFunds. Insufficient balance', address);
            return null;
        }
        if (balance < totalAmount) {
            throw new Error(`Insufficient balance: ${balance}. Needed: ${totalAmount}`);
        }

        return new Promise((resolve, reject) => {
            const remainderAddress = generateAddress(seed, keyIndex + 1);
            const options = {
                inputs: [{
                    address,
                    keyIndex,
                    security,
                    balance
                }],
                security,
                remainderAddress
            };

            prepareTransfers(seed, transfers, options)
                .then(async trytes => {
                    sendTrytes(trytes, depth, minWeightMagnitude)
                        .then(async transactions => {
                            // Before the payment is confirmed update the wallet with new address and index, calculate expected balance
                            await updateWallet(seed, remainderAddress, keyIndex + 1, balance - totalAmount);

                            const hashes = transactions.map(transaction => transaction.hash);

                            let retries = 0;
                            while (retries++ < 40) {
                                const statuses = await getInclusionStates(hashes);
                                if (statuses.filter(status => status).length === 4) {
                                    break;
                                }
                                await new Promise(resolved => setTimeout(resolved, 5000));
                            }

                            // Once the payment is confirmed fetch the real wallet balance and update the wallet again
                            const newBalance = await getBalance(remainderAddress);
                            await updateWallet(seed, remainderAddress, keyIndex + 1, newBalance);
                            
                            resolve(transactions);
                        })
                        .catch(error => {
                            console.error('transferFunds sendTrytes error', error);
                            reject(error);
                        });
                })
                .catch(error => {
                    console.error('transferFunds prepareTransfers error', error);
                    reject(error);
                });
        });
    } catch (error) {
        console.error('transferFunds catch', error);
        return error;
    }
};

const updateWallet = async (seed, address, keyIndex, balance) => {
    await writeData('wallet', { address, balance, keyIndex, seed });
};

export const processPayment = async () => {
    try {
        console.log('processPayment start');
        interface IWallet {
            address?: string;
            balance?: number;
            keyIndex?: number;
            seed?: string;
        }

        const wallet: IWallet = await readData('wallet');
    
        if (!wallet) {
            console.log('processPayment error. No Wallet');
            return null;
        }

        const walletBalance = await getBalance(wallet.address);
        console.log('processPayment check wallet', wallet.address, walletBalance);
        if (walletBalance === 0) {
          const newWallet = generateNewWallet();
          console.log('processPayment generating new wallet', newWallet);
          try {
              const response = await axios.get(`${faucet}?address=${newWallet.address}&amount=${faucetAmount}`);
              const data = response.data;
              if (data.success) {
                  const balance = await getBalance(newWallet.address);
                  await writeData('wallet', { ...newWallet, balance });
                  return null;
              }
          } catch (error) {
              console.log('fund wallet error', error);
              throw new Error('Wallet funding error');
              return null;
          }
          console.log('processPayment funding new wallet', newWallet);
          return null;
        }

        let totalAmount = 0;
        const paymentQueue: any = await processPaymentQueue();
        console.log('processPayment paymentQueue', paymentQueue);
        paymentQueue.forEach(({ value }) => totalAmount += value);
        console.log('processPayment', totalAmount, wallet);
        
        if (paymentQueue.length === 0 || totalAmount === 0) {
            return null;
        }

        return await transferFunds(
            wallet,
            totalAmount,
            paymentQueue
        );
    } catch (error) {
        console.error('transferFunds catch', error);
        return error;
    }
};

/*
Example getBalance operation:

import { getBalance } from './walletHelper';

await getBalance(address);

*/

/*
Example payment operation:

import { processPayment } from './walletHelper';

await processPayment();

*/
