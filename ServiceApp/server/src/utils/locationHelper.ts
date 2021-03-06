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


export const getLocationFromMessage = message => {
    return message.frame && message.frame.location ? message.frame.location : null;
};

export const calculateDistance = (locObj1, locObj2) => {
    const coordsArr1 = locObj1.split(',');
    const lat1 = Number(coordsArr1[0]);
    const lon1 = Number(coordsArr1[1]);

    const coordsArr2 = locObj2.split(',');
    const lat2 = Number(coordsArr2[0]);
    const lon2 = Number(coordsArr2[1]);

    if ((lat1 === lat2) && (lon1 === lon2)) {
        return 0;
    } else {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return Math.round(d);
    }
};
