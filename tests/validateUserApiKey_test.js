/* global ApiKeyChecker apiKeyError */
/* eslint-disable jasmine/no-pending-tests */

describe("The API key validator", function() {

	describe("Checks for undefined strings", function() {

		it("should return false when the string is undefined.", function () {
			let result = ApiKeyChecker.checkDiscourseApiKey(undefined);

			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyError.KEY_IS_UNDEFINED);
		});

	});

	describe("Checks for empty strings", function() {

		it("should return false when the string is defined but empty.", function () {
			let result = ApiKeyChecker.checkDiscourseApiKey("");

			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyError.KEY_IS_EMPTY);

			result = ApiKeyChecker.checkDiscourseApiKey("      ");

			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyError.KEY_IS_EMPTY);
		});

	});

	describe("Checks for hexadecimals. (spaces on the side must be trimmed)", function() {

		it("should return false when the key is not in HEX.", function () {

			let result = ApiKeyChecker.checkDiscourseApiKey("abcdefg12345678");
			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyError.KEY_IS_NOT_ONLY_LOWERCASE_HEXADECIMALS);

			result = ApiKeyChecker.checkDiscourseApiKey("3820235820efa0i");
			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyError.KEY_IS_NOT_ONLY_LOWERCASE_HEXADECIMALS);

			result = ApiKeyChecker.checkDiscourseApiKey("true");
			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyError.KEY_IS_NOT_ONLY_LOWERCASE_HEXADECIMALS);

			result = ApiKeyChecker.checkDiscourseApiKey("z");
			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyError.KEY_IS_NOT_ONLY_LOWERCASE_HEXADECIMALS);

			result = ApiKeyChecker.checkDiscourseApiKey("helloworld");
			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyError.KEY_IS_NOT_ONLY_LOWERCASE_HEXADECIMALS);

			result = ApiKeyChecker.checkDiscourseApiKey("000000000000000t0");
			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyError.KEY_IS_NOT_ONLY_LOWERCASE_HEXADECIMALS);
		});

		it("should return false when the key contains spaces in the middle.", function () {

			let result = ApiKeyChecker.checkDiscourseApiKey("1 2345678901234567890123456789012");
			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyError.KEY_IS_NOT_ONLY_LOWERCASE_HEXADECIMALS);

			result = ApiKeyChecker.checkDiscourseApiKey("1234567890123456789012345678901 2 ");
			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyError.KEY_IS_NOT_ONLY_LOWERCASE_HEXADECIMALS);

			result = ApiKeyChecker.checkDiscourseApiKey("1234567890123               4567890123456789012");
			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyError.KEY_IS_NOT_ONLY_LOWERCASE_HEXADECIMALS);

			result = ApiKeyChecker.checkDiscourseApiKey("1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2");
			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyError.KEY_IS_NOT_ONLY_LOWERCASE_HEXADECIMALS);
		});

	});

	describe("Checks for the correct amound of characters. (spaces on the side must be trimmed)", function() {

		it("should return false when the key does not contain 32 characters.", function () {

			let result = ApiKeyChecker.checkDiscourseApiKey("1");
			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyError.KEY_DOES_NOT_CONTAIN_EXACTLY_32_CHARACTERS);

			result = ApiKeyChecker.checkDiscourseApiKey("123456789012345678901234567890123");
			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyError.KEY_DOES_NOT_CONTAIN_EXACTLY_32_CHARACTERS);

			result = ApiKeyChecker.checkDiscourseApiKey("1234567890123456789012345678901");
			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyError.KEY_DOES_NOT_CONTAIN_EXACTLY_32_CHARACTERS);

			result = ApiKeyChecker.checkDiscourseApiKey("0123456789abcdef0123456789abcdef0");
			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyError.KEY_DOES_NOT_CONTAIN_EXACTLY_32_CHARACTERS);

			result = ApiKeyChecker.checkDiscourseApiKey("0123456789abcdef0123456789abcde");
			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyError.KEY_DOES_NOT_CONTAIN_EXACTLY_32_CHARACTERS);

			result = ApiKeyChecker.checkDiscourseApiKey("   0123456789abcdef0123456789   ");
			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyError.KEY_DOES_NOT_CONTAIN_EXACTLY_32_CHARACTERS);

		});

	});

	describe("Checks for good keys", function() {

		it("should return true when the key has a valid syntax.", function () {

			let result = ApiKeyChecker.checkDiscourseApiKey("0123456789abcdef0123456789abcdef");
			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyError.KEY_IS_NOT_ONLY_LOWERCASE_HEXADECIMALS);

			result = ApiKeyChecker.checkDiscourseApiKey("12345678901234567890123456789012");
			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyError.KEY_IS_NOT_ONLY_LOWERCASE_HEXADECIMALS);

			result = ApiKeyChecker.checkDiscourseApiKey("        0123456789abcdef0123456789abcdef    ");
			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyError.KEY_IS_NOT_ONLY_LOWERCASE_HEXADECIMALS);

			result = ApiKeyChecker.checkDiscourseApiKey("0123456789abcdef0123456789abcdef   ");
			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyError.KEY_IS_NOT_ONLY_LOWERCASE_HEXADECIMALS);

			result = ApiKeyChecker.checkDiscourseApiKey(" 0123456789abcdef0123456789abcdef");
			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyError.KEY_IS_NOT_ONLY_LOWERCASE_HEXADECIMALS);

		});

		it("should return true when the key has a valid syntax. Uppercase keys should be accepted as well and converted to lowercase.", function () {

			let result = ApiKeyChecker.checkDiscourseApiKey("AEFABBC394030AEFABBC3940309286BE");
			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyError.KEY_IS_NOT_ONLY_LOWERCASE_HEXADECIMALS);

			result = ApiKeyChecker.checkDiscourseApiKey("AEFaBBC394030aefABBC3940309286BE");
			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyError.KEY_IS_NOT_ONLY_LOWERCASE_HEXADECIMALS);

			result = ApiKeyChecker.checkDiscourseApiKey("        aAbBcDeEfF12345678900987654321    ");
			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyError.KEY_IS_NOT_ONLY_LOWERCASE_HEXADECIMALS);

			result = ApiKeyChecker.checkDiscourseApiKey("ABC   ");
			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyError.KEY_IS_NOT_ONLY_LOWERCASE_HEXADECIMALS);

			result = ApiKeyChecker.checkDiscourseApiKey(" 1234567890123456789012345678900A");
			expect(result.success).toBe(false);
			expect(result.error).toBe(apiKeyError.KEY_IS_NOT_ONLY_LOWERCASE_HEXADECIMALS);

		});

	});

});
