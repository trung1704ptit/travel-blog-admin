import { AxiosError } from 'axios';
import { toast } from 'sonner';

export enum NotificationType {
  ERROR = 'error',
  SUCCESS = 'success',
}

export const setPageTitle = (title: string) => {
  window.document.title = title;
};

// Check if user is logged in via cookie (for page reload persistence)
export const isLoggedIn = (): boolean => {
  const loggedInCookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith('logged_in='))
    ?.split('=')[1];

  return loggedInCookie === 'true';
};

// Get cookie value by name
export const getCookie = (name: string): string | null => {
  const value = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];

  return value || null;
};

export const showNotification = (
  message = 'Something went wrong',
  type: NotificationType = NotificationType.ERROR,
  description?: string
) => {
  toast[type](message, {
    description: description,
  });
};

export const handleErrorResponse = (
  error: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  callback?: () => void,
  errorMessage?: string
) => {
  console.error(error);

  if (!errorMessage) {
    errorMessage = 'Something went wrong';

    if (typeof error === 'string') {
      try {
        error = JSON.parse(error);
      } catch (error) {
        // do nothing
      }
    }

    if (error instanceof AxiosError && error?.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error?.message) {
      errorMessage = error.message;
    }
  }

  showNotification(
    errorMessage &&
      errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1),
    NotificationType.ERROR
  );

  if (callback) {
    return callback();
  }
};

/**
 * Generate a URL-friendly slug from a title
 * @param title - The title to convert to slug
 * @returns A URL-friendly slug
 */
export const generateSlug = (title: string): string => {
  if (!title) return '';

  return (
    title
      .toString()
      // Normalize: turn "é" → "e", "đ" → "d"
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove diacritics
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D') // Vietnamese special
      // Lowercase
      .toLowerCase()
      // Replace anything not alphanumeric (Unicode letters) with -
      .replace(/[^a-z0-9\u4e00-\u9fff\u3040-\u30ff\u0600-\u06ff]+/g, '-')
      // Trim -
      .replace(/^-+|-+$/g, '')
      // Avoid multiple -
      .replace(/-{2,}/g, '-')
  );
};

/**
 * Generate a unique slug by appending a number if the slug already exists
 * @param baseSlug - The base slug to make unique
 * @param existingSlugs - Array of existing slugs to check against
 * @returns A unique slug
 */
export const generateUniqueSlug = (
  baseSlug: string,
  existingSlugs: string[]
): string => {
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }

  let counter = 1;
  let uniqueSlug = `${baseSlug}-${counter}`;

  while (existingSlugs.includes(uniqueSlug)) {
    counter++;
    uniqueSlug = `${baseSlug}-${counter}`;
  }

  return uniqueSlug;
};
