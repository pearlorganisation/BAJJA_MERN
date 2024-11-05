class ApiResponse {
  constructor(message = "Success", data = null, statusCode) {
    this.success = true;
    this.message = message;
    // this.statusCode = statusCode;
    this.data = data;
  }

  // Called by res.json() automatically | Converts the ApiResponse to a JSON-friendly format, excluding statusCode.
  toJSON() {
    return {
      success: this.success,
      message: this.message,
      ...(this.data && { data: this.data }), // Only include data if it's present
    };
  }
}

export { ApiResponse };
