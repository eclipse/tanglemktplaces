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

import '../assets/styles/content.scss'

export default () => (
    <div className="callToAction-wrapper">
        <Text className="title">Explore for yourself</Text>
        <Text>To see how the Industry Marketplace operates, try our demo, or dive into the extended documentation to get started</Text>
        <div className="callToAction-buttons-wrapper">
            <Link to="/demo">
                <img className="intro-page-btn secondary" alt="Try the demo" src={tryIt} />
            </Link>
            <Link to="/executive_summary">
                <Button className="medium primary">
                    Get started
                </Button>
            </Link>
        </div>
    </div>
)
