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

import UIKit
import URLNavigator
import Swinject
import SwinjectAutoregistration
import SwinjectStoryboard

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

	var window: UIWindow?
    
    /* The dependency injection container of this application */
    let container: Container = {
        let container = Container()
        
        // URLNavigator
        container
            .register(NavigatorType.self) { _ in Navigator() }
            .inObjectScope(.container)
        

        // REST Configuration
        container
            .register(AuthorizationService.self) { r in
                let baseUrl: String = Bundle.main.object(forInfoDictionaryKey: "BOOKLAB_API_BASE_URL") as! String
                let id: String = Bundle.main.object(forInfoDictionaryKey: "BOOKLAB_API_OAUTH_ID") as! String
                let secret: String = Bundle.main.object(forInfoDictionaryKey: "BOOKLAB_API_OAUTH_SECRET") as! String
                
                
                return AuthorizationService(
                    baseUrl: "\(baseUrl)/auth",
                    clientId: id,
                    clientSecret: secret
                )
            }
        
        container
            .register(BackendService.self) { r in
                let baseUrl: String = Bundle.main.object(forInfoDictionaryKey: "BOOKLAB_API_BASE_URL") as! String
                return BackendService(authorization: r~>, baseUrl: baseUrl)
            }
        
        // Storyboard
        container
            .register(SwinjectStoryboard.self) { r in SwinjectStoryboard.create(name: "Main", bundle: nil, container: r) }
            .inObjectScope(.container)
        
        container.storyboardInitCompleted(ViewController.self) { r, c in
            let backend = r ~> BackendService.self
            c.navigator = r ~> NavigatorType.self
            c.authorization = r ~> AuthorizationService.self
            c.api = backend
        }
        return container
    }()
    

	func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
        // Initialise the routes of the application
        Routes.initialize(container: container, navigator: container ~> NavigatorType.self)
        
        let window = UIWindow(frame: UIScreen.main.bounds)
        window.makeKeyAndVisible()
        self.window = window
        
        let storyboard = container ~> SwinjectStoryboard.self
        window.rootViewController = UINavigationController(rootViewController: storyboard.instantiateInitialViewController()!)
      
		return true
	}
    
    func application(_ app: UIApplication, open url: URL, options: [UIApplicationOpenURLOptionsKey: Any]) -> Bool {
        let navigator = container ~> NavigatorType.self
        // Try presenting the URL first
        if navigator.present(url, wrap: UINavigationController.self) != nil {
            return true
        }
        
        // Try opening the URL
        if navigator.open(url) == true {
            return true
        }

        return false
    }

	func applicationWillResignActive(_ application: UIApplication) {
		// Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
		// Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
	}

	func applicationDidEnterBackground(_ application: UIApplication) {
		// Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
		// If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
	}

	func applicationWillEnterForeground(_ application: UIApplication) {
		// Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
	}

	func applicationDidBecomeActive(_ application: UIApplication) {
		// Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
	}

	func applicationWillTerminate(_ application: UIApplication) {
		// Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
	}


}

