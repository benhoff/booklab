/*
 * Copyright 2018 The BookLab Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Foundation
import UIKit
import Material

public class CollectionNavigationController : BorderlessNavigationController {
    public override func viewDidLoad() {
        super.viewDidLoad()
        
        prepareTabItem()
    }
}

extension CollectionNavigationController {
    fileprivate func prepareTabItem() {
        tabItem.image = UIImage(named: "BookIcon")?.withRenderingMode(.alwaysTemplate)
        tabItem.pulseColor = Color.pink.darken1
        tabItem.setTabItemColor(Color.pink.base, for: .selected)
        tabItem.setTabItemColor(Color.pink.accent2, for: .highlighted)
        tabItem.setTabItemColor(Color.blueGrey.base, for: .normal)
    }
}
