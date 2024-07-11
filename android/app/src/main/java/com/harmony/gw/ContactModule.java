package com.harmony.gw;

import android.content.Intent;
import android.provider.ContactsContract;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class ContactModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;

    ContactModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "ContactModule";
    }

    @ReactMethod
    public void addContact(String name, String phone, String email, String company, String jobTitle) {
        Intent intent = new Intent(Intent.ACTION_INSERT, ContactsContract.Contacts.CONTENT_URI);

        Bundle bundle = new Bundle();

        if (name != null) {
            bundle.putString(ContactsContract.Intents.Insert.NAME, name);
        }
        if (phone != null) {
            bundle.putString(ContactsContract.Intents.Insert.PHONE, phone);
        }
        if (email != null) {
            bundle.putString(ContactsContract.Intents.Insert.EMAIL, email);
        }
        if (company != null) {
            bundle.putString(ContactsContract.Intents.Insert.COMPANY, company);
        }
        if (jobTitle != null) {
            bundle.putString(ContactsContract.Intents.Insert.JOB_TITLE, jobTitle);
        }

        intent.putExtras(bundle);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        Log.d("intent",intent.toString());
        reactContext.startActivity(intent);
    }
}a