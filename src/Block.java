import java.security.MessageDigest;
import java.util.Date;

public class Block {

    public String previousHash;
    public String data;  // social post data
    public String hash;
    public long timestamp;

    public Block(String data, String previousHash) {
        this.data = data;
        this.previousHash = previousHash;
        this.timestamp = new Date().getTime();
        this.hash = calculateHash();
    }

    public String calculateHash() {
        try {
            String input = previousHash + Long.toString(timestamp) + data;
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(input.getBytes("UTF-8"));

            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
