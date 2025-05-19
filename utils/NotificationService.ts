import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import { type Router } from 'expo-router';

export async function scheduleNotification(
  subscriptionId: string,
  title: string,
  body: string,
  notificationDate: Date
) {
  if (!Device.isDevice) {
    alert('Must use physical device for Push Notifications');
    return;
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const trigger: Notifications.NotificationTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.DATE,
    date: notificationDate,
  };

  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      data: { subscriptionId }, // Embed subscriptionId here
    },
    trigger: trigger,
  });
  console.log(`Notification scheduled for subscription ${subscriptionId} at ${notificationDate}`);
}

export function setupNotificationResponseListener(router: Router) {
  const subscription = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('Notification response received:', response);
    const subscriptionId = response.notification.request.content.data.subscriptionId as string | undefined;
    if (subscriptionId) {
      console.log('Navigating to subscription:', subscriptionId);
      router.push({ pathname: '/AddSubscription', params: { subscriptionId: subscriptionId, isEditing: 'true' } });
    } else {
      console.log('No subscriptionId found in notification data');
    }
  });

  return () => {
    Notifications.removeNotificationSubscription(subscription);
  };
}