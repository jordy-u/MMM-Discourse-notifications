const apiKeyError = {
	"NO_ERROR":0,
	"KEY_IS_UNDEFINED":1,
	"KEY_IS_EMPTY":2,
	"KEY_IS_NOT_ONLY_LOWERCASE_HEXADECIMALS":3,
	"KEY_DOES_NOT_CONTAIN_EXACTLY_32_CHARACTERS":4
};
Object.freeze(apiKeyError);

class ApiKeyChecker {

	//TODO: Implement this function correctly.
	static checkDiscourseApiKey(apiKey) {

		//check if key is defined
		if (true) {
			return {
				success : false,
				error : apiKeyError.KEY_IS_UNDEFINED,
				errorMsg : "'UserApiKey' is not defined in config.js.",
			};
		}

		//check if key is not empty
		if (true) {
			return {
				success : false,
				error : apiKeyError.KEY_IS_EMPTY,
				errorMsg : "'UserApiKey' in config.js is an empty string.",
			};
		}

		//check if key is a lowercase hexadecimal string
		if (true) {
			return {
				success : false,
				error : apiKeyError.KEY_IS_NOT_ONLY_LOWERCASE_HEXADECIMALS,
				errorMsg : "The provided API key has a wrong format. It should only contain lowercase hexadecimals.",
			};
		}

		//check if key has a length of 32
		if (true) {
			return {
				success : false,
				error : apiKeyError.KEY_DOES_NOT_CONTAIN_EXACTLY_32_CHARACTERS,
				errorMsg : "Invalid API key length. It should be 32 characters long.",
			};
		}

		//Check passed.
		return {
			success : true,
			error : apiKeyError.NO_ERROR,
			errorMsg : "No error",
		};
	}
}