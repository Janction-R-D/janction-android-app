package com.janctionmobile

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.janctionmobile.YolovActivity
import android.util.Log


class NavigationModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "NavigationModule"
    }

    @ReactMethod
    fun navigateToActivity(activityName: String) {
        Log.d("NavigationModule", "Navigating to activity: $activityName")
        try {
//            val activityClass = Class.forName(activityName)
            Log.d("NavigationModule", "Navigating to activity: $activityName")
            try {
                val intent = Intent(reactApplicationContext, YolovActivity::class.java)
                intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
                reactApplicationContext.startActivity(intent)
            } catch (e: ClassNotFoundException) {
                e.printStackTrace()
            }
        } catch (e: ClassNotFoundException) {
            e.printStackTrace()
        }
    }
}
