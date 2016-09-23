package com.shortcutsforslack;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * Created by freeatnet on 2016-09-23.
 */

public class ShortcutsModule extends ReactContextBaseJavaModule {

    private Context mApplicationContext;

    public ShortcutsModule(ReactApplicationContext reactContext) {
        super(reactContext);

        mApplicationContext = getReactApplicationContext().getBaseContext();
    }

    @Override
    public String getName() {
        return "ShortcutsAndroid";
    }

    @ReactMethod
    public void show(String displayName, String url) {
        Intent shortcutIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
        shortcutIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_MULTIPLE_TASK);


        Intent intent = new Intent();
        intent.putExtra(Intent.EXTRA_SHORTCUT_INTENT, shortcutIntent);
        // Sets the custom shortcut's title
        intent.putExtra(Intent.EXTRA_SHORTCUT_NAME, displayName);
        // Set the custom shortcut icon
//        intent.putExtra(Intent.EXTRA_SHORTCUT_ICON_RESOURCE, Intent.ShortcutIconResource.fromContext(context, R.drawable.ic_action_search));
        intent.putExtra("duplicate", false);

        // add the shortcut
        intent.setAction("com.android.launcher.action.INSTALL_SHORTCUT");
        mApplicationContext.sendBroadcast(intent);
    }
}
