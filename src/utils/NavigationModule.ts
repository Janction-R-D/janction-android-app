import { NativeModules } from 'react-native';

type NavigationModuleType = {
  navigateToActivity(activityName: string): void;
};

const { NavigationModule } = NativeModules;

export default NavigationModule as NavigationModuleType;
