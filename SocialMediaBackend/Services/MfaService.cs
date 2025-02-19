using OtpNet;
using System;
using System.Security.Cryptography;

namespace SocialMediaBackend.Services
{
    public class MfaService
    {
        public string GenerateSecretKey()
        {
            var key = KeyGeneration.GenerateRandomKey(20);
            // Remove any '=' padding if present
            return Base32Encoding.ToString(key).TrimEnd('=');
        }

        public string GenerateQrCodeUri(string email, string secretKey, string issuer = "YourApp")
        {
            // URL-encode parameters to ensure special characters are handled properly
            string encodedIssuer = Uri.EscapeDataString(issuer);
            string encodedEmail = Uri.EscapeDataString(email);
            string encodedSecret = Uri.EscapeDataString(secretKey);
            
            // Construct the otpauth URI with explicit algorithm, digits, and period parameters
            return $"otpauth://totp/{encodedIssuer}:{encodedEmail}?secret={encodedSecret}&issuer={encodedIssuer}&algorithm=SHA1&digits=6&period=30";
        }

        public bool ValidateCode(string secretKey, string code)
        {
            var key = Base32Encoding.ToBytes(secretKey);
            var totp = new Totp(key);
            // Allow a verification window of 2 intervals before/after
            return totp.VerifyTotp(code, out long timeStepMatched, new VerificationWindow(2, 2));
        }

        public string[] GenerateRecoveryCodes(int count = 10)
        {
            var codes = new string[count];
            for (int i = 0; i < count; i++)
            {
                codes[i] = Convert.ToBase64String(RandomNumberGenerator.GetBytes(8))
                           .Replace("=", "").Replace("+", "").Replace("/", "");
            }
            return codes;
        }
    }
}
