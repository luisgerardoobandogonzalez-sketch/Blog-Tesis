import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.universidad.blog',
    appName: 'Blog Universitario',
    webDir: 'www',
    bundledWebRuntime: false,
    server: {
        androidScheme: 'https'
    },
    plugins: {
        SplashScreen: {
            launchShowDuration: 2000,
            launchAutoHide: true,
            backgroundColor: "#5260ff",
            androidSplashResourceName: "splash",
            androidScaleType: "CENTER_CROP",
            showSpinner: false,
            androidSpinnerStyle: "large",
            iosSpinnerStyle: "small",
            spinnerColor: "#ffffff",
        },
        PushNotifications: {
            presentationOptions: ["badge", "sound", "alert"]
        },
        StatusBar: {
            style: 'DEFAULT',
            backgroundColor: '#5260ff'
        }
    }
};

export default config;
