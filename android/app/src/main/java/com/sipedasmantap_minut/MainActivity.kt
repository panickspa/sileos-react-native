package com.sipedasmantap_minut

import android.content.Context
import android.content.Intent
import android.os.Build
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import android.os.Bundle
import android.util.Log
import com.sipedasmantap_minut.SyncDBService

class MainActivity : ReactActivity() {

    inner class SyncDBJobs(context: Context): Runnable {
        private val context = context
        override public fun run() {
            val syncServe = Intent(applicationContext, SyncDBService::class.java)
            val bundle = Bundle()

            bundle.putString("data", "bar")

            syncServe.putExtras(bundle)

            Log.i("responseRaw", "Tread Started")

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                this.context.startForegroundService(syncServe)
            }
        }
    }
  override fun onCreate(savedInstanceState: Bundle?) {
      super.onCreate(null);
//      val intent = Intent(applicationContext, SyncDBService::class.java)
//      val bundle = Bundle()
//
//      bundle.putString("data", "bar")
//
//      intent.putExtras(bundle)

//      Thread(SyncDBJobs(this.applicationContext)).start()
  }

//    override fun onStart() {
//        super.onStart()
////        Thread(SyncDBJobs(this.applicationContext)).start()
//    }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "sileosrn"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
