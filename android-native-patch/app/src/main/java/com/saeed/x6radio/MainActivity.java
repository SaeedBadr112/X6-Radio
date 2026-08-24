package com.saeed.x6radio;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // تسجيل البلوجن المخصص لتشغيل الصوت في الخلفية قبل استدعاء super.onCreate
        registerPlugin(BackgroundAudioPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
