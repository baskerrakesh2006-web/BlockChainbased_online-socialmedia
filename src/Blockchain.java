import java.util.ArrayList;

public class Blockchain {

    public static ArrayList<Block> blockchain = new ArrayList<>();

    public static void addBlock(Block newBlock) {
        blockchain.add(newBlock);
    }

    public static boolean isChainValid() {
        Block currentBlock;
        Block previousBlock;

        for (int i = 1; i < blockchain.size(); i++) {

            currentBlock = blockchain.get(i);
            previousBlock = blockchain.get(i - 1);

            if (!currentBlock.hash.equals(currentBlock.calculateHash())) {
                return false;
            }

            if (!currentBlock.previousHash.equals(previousBlock.hash)) {
                return false;
            }
        }

        return true;
    }
}
