# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:
-keep class okhttp3.**
-keep class okio.**
-keep class javax.annotation.**
-keep class org.conscrypt.**
-keep class java.nio.file.Files
-keep class java.nio.file.Path
-keep class java.nio.file.OpenOption
-keep class org.codehaus.mojo.animal_sniffer.IgnoreJRERequirement
-keep class io.invertase.firebase.** { *; }
-dontwarn io.invertase.firebase.**
# A resource is loaded with a relative path so the package of this class must be preserved.
-keepnames class okhttp3.internal.publicsuffix.PublicSuffixDatabase
-keepclassmembers class fqcn.of.javascript.interface.for.webview {
   public *;
}
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }
-keep public class com.horcrux.svg.** {*;}