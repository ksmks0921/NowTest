package com.deqod.sizex;

import android.app.Application;

import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.react.ReactApplication;
import com.christopherdro.RNPrint.RNPrintPackage;
import com.christopherdro.htmltopdf.RNHTMLtoPDFPackage;
import com.psykar.cookiemanager.CookieManagerPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

// optional packages - add/remove as appropriate
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage; // Firebase Analytics
import io.invertase.firebase.auth.RNFirebaseAuthPackage; // Firebase Auth
import io.invertase.firebase.database.RNFirebaseDatabasePackage; // Firebase Realtime Database
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage; // Firebase Firestore

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
  // react-native-fbsdk
  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
        new MainReactPackage(),
            new RNPrintPackage(),
            new RNHTMLtoPDFPackage(),
            new CookieManagerPackage(),
            new RNGoogleSigninPackage(),
            new FBSDKPackage(),
            new VectorIconsPackage(),
        new VectorIconsPackage(),
        new RNGoogleSigninPackage(),
        new FBSDKPackage(mCallbackManager),
        new RNFirebasePackage(),
        // add/remove these packages as appropriate
        new RNFirebaseAnalyticsPackage(),
        new RNFirebaseAuthPackage(),
        new RNFirebaseDatabasePackage(),
        new RNFirebaseFirestorePackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);

    // react-native-fbsdk
    FacebookSdk.sdkInitialize(getApplicationContext());
  }

  // react-native-fbsdk
  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }
}
