/**
 * Options for paginating results
 */
export interface PaginationOptions {
  /** Page number to retrieve */
  page?: number;
  /** Number of items per page */
  limit?: number;
}

/**
 * Result object containing paginated data and metadata
 */
export interface PaginatedResult<T> {
  /** Array of paginated items */
  data: T[];
  /** Current page number */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Total number of items */
  totalItems: number;
}

/**
 * Paginates an array of items
 * @param data - Array of items to paginate
 * @param page - Current page number
 * @param limit - Number of items per page
 * @returns Paginated result object
 */
export const paginate = <T>(
  data: T[],
  page: number,
  limit: number,
): PaginatedResult<T> => {
  // Ensure valid pagination parameters
  const validPage = Math.max(1, page);
  const validLimit = Math.max(1, limit);

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / validLimit);

  const startIndex = (validPage - 1) * validLimit;
  const endIndex = startIndex + validLimit;
  const slicedData = data.slice(startIndex, endIndex);

  return {
    data: slicedData,
    currentPage: validPage,
    totalPages,
    totalItems,
  };
};
