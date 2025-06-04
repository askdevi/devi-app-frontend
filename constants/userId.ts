import * as SecureStore from 'expo-secure-store';

export async function getUserId() {
    return await SecureStore.getItemAsync('userId') || null;
}

export async function clearUserId() {
    await SecureStore.deleteItemAsync('userId');
}