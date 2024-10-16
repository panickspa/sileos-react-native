package com.sipedasmantap_minut;

import android.app.Application
import android.content.Intent
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.bridge.Arguments
import com.facebook.react.jstasks.HeadlessJsTaskConfig
import com.facebook.react.jstasks.HeadlessJsTaskRetryPolicy
import com.facebook.react.jstasks.LinearCountingRetryPolicy

class SyncDBService : HeadlessJsTaskService() {
    public final val retryPolicy: HeadlessJsTaskRetryPolicy =
        LinearCountingRetryPolicy(
            10, // Max number of retry attempts
            1000 // Delay between each retry attempt
        )
    override fun getTaskConfig(intent: Intent): HeadlessJsTaskConfig? {
        //        val notificationCompat = NotificationCompat.Builder(
        //            this, "HEADLESS_SERVICE"
        //        ).setContentTitle("Pegasus Minut Sync")
        //        .setContentText("Pegasus Minut sedang melakukan sinkronisasi data")
        //            .build()
        //        startForeground(1, notificationCompat)
        return intent.extras?.let {
            HeadlessJsTaskConfig(
                TASK_NAME,
                Arguments.fromBundle(it),
                5000, // timeout for the task
                true, // optional: defines whether or not the task is allowed in foreground.
                // Default is false
                retryPolicy
            )
        }
    }

    companion object {
        const val TASK_NAME = "SyncDBService"
    }
}