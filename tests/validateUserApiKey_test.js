const apiKeyChecker = new ApiKeyChecker();

describe("The API key validator", function() {

	describe("Checks for undefined strings", function() {

		it("should return false when the string is undefined.", function () {

			let result = apiKeyChecker.checkDiscourseApiKey(undefined);

			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyChecker.apiKeyError.KEY_IS_UNDEFINED_OR_NOT_A_STRING);
		});

	});

	describe("Checks for empty strings", function() {

		it("should return false when the string is defined but empty.", function () {
			let result = apiKeyChecker.checkDiscourseApiKey("");

			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyChecker.apiKeyError.KEY_IS_EMPTY);

			result = apiKeyChecker.checkDiscourseApiKey("      ");

			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyChecker.apiKeyError.KEY_IS_EMPTY);
		});

	});

	describe("Checks for hexadecimals. (spaces on the side must be trimmed)", function() {

		it("should return false when the key is not a (HEX) string of 32 characters.", function () {

			let result = apiKeyChecker.checkDiscourseApiKey("abcdefg12345678");

			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyChecker.apiKeyError.KEY_DOES_NOT_EQUAL_32_HEXADECIMAL_NUMBERS);

			result = apiKeyChecker.checkDiscourseApiKey("3820235820efa0i");

			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyChecker.apiKeyError.KEY_DOES_NOT_EQUAL_32_HEXADECIMAL_NUMBERS);

			result = apiKeyChecker.checkDiscourseApiKey("true");

			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyChecker.apiKeyError.KEY_DOES_NOT_EQUAL_32_HEXADECIMAL_NUMBERS);

			result = apiKeyChecker.checkDiscourseApiKey("z");

			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyChecker.apiKeyError.KEY_DOES_NOT_EQUAL_32_HEXADECIMAL_NUMBERS);

			result = apiKeyChecker.checkDiscourseApiKey("helloworld");

			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyChecker.apiKeyError.KEY_DOES_NOT_EQUAL_32_HEXADECIMAL_NUMBERS);

			result = apiKeyChecker.checkDiscourseApiKey("000000000000000t0");

			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyChecker.apiKeyError.KEY_DOES_NOT_EQUAL_32_HEXADECIMAL_NUMBERS);
		});

		it("should return false when the key contains spaces in the middle.", function () {

			let result = apiKeyChecker.checkDiscourseApiKey("1 2345678901234567890123456789012");

			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyChecker.apiKeyError.KEY_DOES_NOT_EQUAL_32_HEXADECIMAL_NUMBERS);

			result = apiKeyChecker.checkDiscourseApiKey("1234567890123456789012345678901 2 ");

			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyChecker.apiKeyError.KEY_DOES_NOT_EQUAL_32_HEXADECIMAL_NUMBERS);

			result = apiKeyChecker.checkDiscourseApiKey("1234567890123               4567890123456789012");

			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyChecker.apiKeyError.KEY_DOES_NOT_EQUAL_32_HEXADECIMAL_NUMBERS);

			result = apiKeyChecker.checkDiscourseApiKey("1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2");

			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyChecker.apiKeyError.KEY_DOES_NOT_EQUAL_32_HEXADECIMAL_NUMBERS);
		});

	});

	describe("Checks for the correct amount of characters. (spaces on the side must be trimmed)", function() {

		it("should return false when the key does not contain 32 characters.", function () {

			let result = apiKeyChecker.checkDiscourseApiKey("1");

			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyChecker.apiKeyError.KEY_DOES_NOT_EQUAL_32_HEXADECIMAL_NUMBERS);

			result = apiKeyChecker.checkDiscourseApiKey("123456789012345678901234567890123");

			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyChecker.apiKeyError.KEY_DOES_NOT_EQUAL_32_HEXADECIMAL_NUMBERS);

			result = apiKeyChecker.checkDiscourseApiKey("1234567890123456789012345678901");

			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyChecker.apiKeyError.KEY_DOES_NOT_EQUAL_32_HEXADECIMAL_NUMBERS);

			result = apiKeyChecker.checkDiscourseApiKey("0123456789abcdef0123456789abcdef0");

			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyChecker.apiKeyError.KEY_DOES_NOT_EQUAL_32_HEXADECIMAL_NUMBERS);

			result = apiKeyChecker.checkDiscourseApiKey("0123456789abcdef0123456789abcde");

			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyChecker.apiKeyError.KEY_DOES_NOT_EQUAL_32_HEXADECIMAL_NUMBERS);

			result = apiKeyChecker.checkDiscourseApiKey("   0123456789abcdef0123456789   ");

			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyChecker.apiKeyError.KEY_DOES_NOT_EQUAL_32_HEXADECIMAL_NUMBERS);

		});

	});

	describe("Checks for valid keys", function() {

		it("should return true when the key has a valid syntax.", function () {

			let result = apiKeyChecker.checkDiscourseApiKey("0123456789abcdef0123456789abcdef");

			expect(result.success).toBe(true);
			expect(result.error).toBe(apiKeyChecker.apiKeyError.NO_ERROR);

			result = apiKeyChecker.checkDiscourseApiKey("12345678901234567890123456789012");

			expect(result.success).toBe(true);
			expect(result.error).toBe(apiKeyChecker.apiKeyError.NO_ERROR);

			result = apiKeyChecker.checkDiscourseApiKey("        0123456789abcdef0123456789abcdef    ");

			expect(result.success).toBe(true);
			expect(result.error).toBe(apiKeyChecker.apiKeyError.NO_ERROR);

			result = apiKeyChecker.checkDiscourseApiKey("0123456789abcdef0123456789abcdef   ");

			expect(result.success).toBe(true);
			expect(result.error).toBe(apiKeyChecker.apiKeyError.NO_ERROR);

			result = apiKeyChecker.checkDiscourseApiKey(" 0123456789abcdef0123456789abcdef");

			expect(result.success).toBe(true);
			expect(result.error).toBe(apiKeyChecker.apiKeyError.NO_ERROR);

		});

		it("should return true when the key has a valid syntax. Uppercase keys should be accepted as well and converted to lowercase.", function () {

			let result = apiKeyChecker.checkDiscourseApiKey("AEFABBC394030AEFABBC3940309286BE");

			expect(result.success).toBe(true);
			expect(result.error).toBe(apiKeyChecker.apiKeyError.NO_ERROR);

			result = apiKeyChecker.checkDiscourseApiKey("AEFaBBC394030aefABBC3940309286BE");

			expect(result.success).toBe(true);
			expect(result.error).toBe(apiKeyChecker.apiKeyError.NO_ERROR);

			result = apiKeyChecker.checkDiscourseApiKey(" 1234567890123456789012345678900A");

			expect(result.success).toBe(true);
			expect(result.error).toBe(apiKeyChecker.apiKeyError.NO_ERROR);

		});

	});

});
