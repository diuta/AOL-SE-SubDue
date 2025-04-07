import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

interface DatabaseServiceType {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  getSubscriptions<T>(): Promise<T[]>;
  saveSubscriptions<T>(subscriptions: T[]): Promise<void>;
  addSubscription<T>(subscription: T): Promise<void>;
  removeSubscriptionById(id: string): Promise<void>;
}

/**
 * Database service for cross-platform storage
 * Provides a unified API for storing, retrieving, and removing data
 * Works with AsyncStorage on native platforms and localStorage on web
 */
const DatabaseService: DatabaseServiceType = {
  /**
   * Get an item from storage by key
   * @param key The key to retrieve
   * @returns A promise that resolves to the value or null if not found
   */
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    } else {
      return await AsyncStorage.getItem(key);
    }
  },

  /**
   * Store an item in storage with the given key
   * @param key The key to store the value under
   * @param value The value to store
   * @returns A promise that resolves when the operation is complete
   */
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === "web") {
      localStorage.setItem(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  },

  /**
   * Remove an item from storage by key
   * @param key The key to remove
   * @returns A promise that resolves when the operation is complete
   */
  async removeItem(key: string): Promise<void> {
    if (Platform.OS === "web") {
      localStorage.removeItem(key);
    } else {
      await AsyncStorage.removeItem(key);
    }
  },

  /**
   * Get all subscription data
   * @returns A promise that resolves to an array of subscriptions or an empty array
   */
  async getSubscriptions<T>(): Promise<T[]> {
    const data = await this.getItem("subscriptions");
    return data ? JSON.parse(data) : [];
  },

  /**
   * Save subscriptions data
   * @param subscriptions The array of subscriptions to save
   * @returns A promise that resolves when the operation is complete
   */
  async saveSubscriptions<T>(subscriptions: T[]): Promise<void> {
    await this.setItem("subscriptions", JSON.stringify(subscriptions));
  },

  /**
   * Add a new subscription to storage
   * @param subscription The subscription to add
   * @returns A promise that resolves when the operation is complete
   */
  async addSubscription<T>(subscription: T): Promise<void> {
    const subscriptions = await this.getSubscriptions<T>();
    subscriptions.push(subscription);
    await this.saveSubscriptions(subscriptions);
  },

  /**
   * Remove a subscription by ID
   * @param id The ID of the subscription to remove
   * @returns A promise that resolves when the operation is complete
   */
  async removeSubscriptionById(id: string): Promise<void> {
    const subscriptions = await this.getSubscriptions<{id: string}>();
    const filteredSubscriptions = subscriptions.filter(
      (sub) => sub.id !== id
    );
    await this.saveSubscriptions(filteredSubscriptions);
  }
};

export default DatabaseService; 