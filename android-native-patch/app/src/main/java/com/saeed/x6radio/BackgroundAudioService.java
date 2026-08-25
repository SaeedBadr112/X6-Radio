package com.saeed.x6radio;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;
import android.support.v4.media.session.MediaSessionCompat;
import androidx.core.app.NotificationCompat;
import androidx.media.app.NotificationCompat.MediaStyle;

/**
 * خدمة Foreground Service حقيقية تُبقي عملية التطبيق حية عندما يكون
 * التطبيق في الخلفية أو الشاشة مقفلة، وتعرض إشعاراً بأزرار تحكم
 * (تشغيل/إيقاف/إغلاق) مرتبطاً بـ MediaSession النظامي حتى تظهر عناصر
 * التحكم أيضاً على شاشة القفل.
 *
 * هذه الخدمة لا تشغّل أي صوت بنفسها — الصوت الفعلي يبقى في WebView.
 * دورها فقط منع نظام أندرويد من إيقاف/تجميد التطبيق أثناء البث.
 */
public class BackgroundAudioService extends Service {

    public static final String ACTION_PLAY = "com.saeed.x6radio.ACTION_PLAY";
    public static final String ACTION_PAUSE = "com.saeed.x6radio.ACTION_PAUSE";
    public static final String ACTION_STOP = "com.saeed.x6radio.ACTION_STOP";

    private static final String CHANNEL_ID = "x6_radio_playback";
    private static final int NOTIFICATION_ID = 5501;

    private MediaSessionCompat mediaSession;
    private String currentTitle = "X6 Radio";
    private String currentArtist = "";
    private boolean isPlaying = true;

    @Override
    public void onCreate() {
        super.onCreate();
        mediaSession = new MediaSessionCompat(this, "X6RadioSession");
        mediaSession.setCallback(new MediaSessionCompat.Callback() {
            @Override
            public void onPlay() { relayToJs(ACTION_PLAY); }
            @Override
            public void onPause() { relayToJs(ACTION_PAUSE); }
            @Override
            public void onStop() { relayToJs(ACTION_STOP); }
        });
        mediaSession.setActive(true);
        createChannelIfNeeded();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent == null) return START_NOT_STICKY;

        String action = intent.getAction();
        if (ACTION_PLAY.equals(action)) { relayToJs(ACTION_PLAY); return START_STICKY; }
        if (ACTION_PAUSE.equals(action)) { relayToJs(ACTION_PAUSE); return START_STICKY; }
        if (ACTION_STOP.equals(action)) { relayToJs(ACTION_STOP); stopForegroundCompat(); stopSelf(); return START_NOT_STICKY; }

        if (intent.hasExtra("title")) currentTitle = intent.getStringExtra("title");
        if (intent.hasExtra("artist")) currentArtist = intent.getStringExtra("artist");
        if (intent.hasExtra("isPlaying")) isPlaying = intent.getBooleanExtra("isPlaying", isPlaying);

        startForeground(NOTIFICATION_ID, buildNotification());
        return START_STICKY;
    }

    private void relayToJs(String action) {
        if (BackgroundAudioPlugin.instance == null) return;
        String jsAction = ACTION_PLAY.equals(action) ? "play"
                : ACTION_PAUSE.equals(action) ? "pause" : "stop";
        BackgroundAudioPlugin.instance.notifyRemoteControl(jsAction);
    }

    private void createChannelIfNeeded() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null && manager.getNotificationChannel(CHANNEL_ID) == null) {
                NotificationChannel channel = new NotificationChannel(
                        CHANNEL_ID, "تشغيل الراديو", NotificationManager.IMPORTANCE_LOW);
                channel.setDescription("إشعار تشغيل البث الإذاعي في الخلفية");
                channel.setShowBadge(false);
                manager.createNotificationChannel(channel);
            }
        }
    }

    private int pendingIntentFlags() {
        return PendingIntent.FLAG_UPDATE_CURRENT
                | (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S ? PendingIntent.FLAG_IMMUTABLE : 0);
    }

    private Notification buildNotification() {
        Intent playPauseIntent = new Intent(this, BackgroundAudioService.class);
        playPauseIntent.setAction(isPlaying ? ACTION_PAUSE : ACTION_PLAY);
        PendingIntent playPausePending = PendingIntent.getService(this, 0, playPauseIntent, pendingIntentFlags());

        Intent stopIntent = new Intent(this, BackgroundAudioService.class);
        stopIntent.setAction(ACTION_STOP);
        PendingIntent stopPending = PendingIntent.getService(this, 1, stopIntent, pendingIntentFlags());

        int playPauseIcon = isPlaying ? android.R.drawable.ic_media_pause : android.R.drawable.ic_media_play;

        // ⚠️ استبدل android.R.drawable.ic_media_play بأيقونة التطبيق الفعلية
        // (مثلاً R.drawable.ic_notification) قبل النشر على المتجر.
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setSmallIcon(android.R.drawable.ic_media_play)
                .setContentTitle(currentTitle)
                .setContentText(currentArtist)
                .setOnlyAlertOnce(true)
                .setOngoing(isPlaying)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .addAction(playPauseIcon, isPlaying ? "إيقاف" : "تشغيل", playPausePending)
                .addAction(android.R.drawable.ic_menu_close_clear_cancel, "إغلاق", stopPending)
                .setStyle(new MediaStyle()
                        .setMediaSession(mediaSession.getSessionToken())
                        .setShowActionsInCompactView(0, 1));

        return builder.build();
    }

    private void stopForegroundCompat() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            stopForeground(Service.STOP_FOREGROUND_REMOVE);
        } else {
            stopForeground(true);
        }
    }

    @Override
    public IBinder onBind(Intent intent) { return null; }

    @Override
    public void onDestroy() {
        if (mediaSession != null) mediaSession.release();
        super.onDestroy();
    }
}
