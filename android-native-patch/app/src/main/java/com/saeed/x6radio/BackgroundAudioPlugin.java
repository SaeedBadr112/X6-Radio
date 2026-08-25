package com.saeed.x6radio;

import android.content.Intent;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * الجسر بين JavaScript (backgroundAudio.js) وخدمة Foreground Service
 * (BackgroundAudioService) التي تُبقي التطبيق حياً وتعرض إشعار تحكم
 * أثناء تشغيل البث في الخلفية أو عند قفل الشاشة.
 *
 * ملاحظة: هذا البلوجن لا يشغّل الصوت بنفسه؛ الصوت الفعلي يبقى يعمل
 * داخل عنصر <audio> في الـ WebView كما هو. مهمة هذا البلوجن فقط:
 *  1) إبقاء عملية التطبيق حية عبر Foreground Service حقيقية.
 *  2) عرض إشعار تحكم (تشغيل/إيقاف) على شاشة القفل ولوحة الإشعارات.
 *  3) تمرير ضغطات أزرار الإشعار مرة أخرى إلى JS ليتحكم بعنصر audio.
 */
@CapacitorPlugin(name = "BackgroundAudio")
public class BackgroundAudioPlugin extends Plugin {

    // مرجع ثابت يستخدمه BackgroundAudioService لإرسال أحداث التحكم إلى JS
    public static BackgroundAudioPlugin instance;

    @Override
    public void load() {
        instance = this;
    }

    @PluginMethod
    public void start(PluginCall call) {
        String title = call.getString("title", "X6 Radio");
        String artist = call.getString("artist", "");

        Intent intent = new Intent(getContext(), BackgroundAudioService.class);
        intent.putExtra("title", title);
        intent.putExtra("artist", artist);
        intent.putExtra("isPlaying", true);

        // startForegroundService مطلوب من Android 8+ (Oreo)
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            getContext().startForegroundService(intent);
        } else {
            getContext().startService(intent);
        }
        call.resolve();
    }

    @PluginMethod
    public void updateMetadata(PluginCall call) {
        String title = call.getString("title", "X6 Radio");
        String artist = call.getString("artist", "");

        Intent intent = new Intent(getContext(), BackgroundAudioService.class);
        intent.putExtra("title", title);
        intent.putExtra("artist", artist);
        getContext().startService(intent);
        call.resolve();
    }

    @PluginMethod
    public void updatePlaybackState(PluginCall call) {
        boolean isPlaying = Boolean.TRUE.equals(call.getBoolean("isPlaying", false));

        Intent intent = new Intent(getContext(), BackgroundAudioService.class);
        intent.putExtra("isPlaying", isPlaying);
        getContext().startService(intent);
        call.resolve();
    }

    @PluginMethod
    public void stop(PluginCall call) {
        Intent intent = new Intent(getContext(), BackgroundAudioService.class);
        getContext().stopService(intent);
        call.resolve();
    }

    /** يُستدعى من BackgroundAudioService عند ضغط المستخدم على زر في الإشعار */
    public void notifyRemoteControl(String action) {
        JSObject data = new JSObject();
        data.put("action", action); // "play" / "pause" / "stop"
        notifyListeners("remoteControl", data);
    }
}
