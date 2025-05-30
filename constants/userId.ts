import * as SecureStore from 'expo-secure-store';

export async function getUserId() {
    return await SecureStore.getItemAsync('userId');
}

export async function clearUserId() {
    await SecureStore.deleteItemAsync('userId');
}