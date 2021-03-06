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

import React from 'react'
import { Link } from 'react-router-dom';
import Text from './Text'
import Button from './Button'
import tryIt from '../assets/img/landing/try_the_demo.svg';
import illustration from '../assets/img/landing/header_illustration.png';

import '../assets/styles/content.scss'

export default () => {
    return (
        <React.Fragment>
            <img className="asset heading" src={illustration} alt="" />
            <div className="intro-wrapper">
                <div className="intro">
                  <Text className="subtitle">First Autonomous</Text>
                    <Text className="subtitle">and Decentralized</Text>
                    <Text className="title">Industry Marketplace</Text>
                    <Text>Discover how the Industry Marketplace acts as an integrated hub to enable the Industry 4.0 vision.</Text>
                </div>
                <div className="intro-buttons-wrapper">
                    <Link to="/demo">
                        <img className="intro-page-btn secondary" alt="Try the demo" src={tryIt} />
                    </Link>
                    <Link to="/executive_summary">
                        <Button className="intro-page-btn medium primary">
                            Get started
                        </Button>
                    </Link>
                    <div className="links-wrapper">
                        <a 
                            href="https://github.com/iotaledger/industry-marketplace" 
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Source code
                        </a>
                        <a 
                            href="https://github.com/iotaledger/industry-marketplace/raw/master/Industry_Marketplace_Technical_Documentation.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Documentation
                        </a>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}
