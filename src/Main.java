public class Main {

    public static void main(String[] args) {

        Blockchain.blockchain.add(
            new Block("User1: Hello this is my first post!", "0")
        );

        Blockchain.blockchain.add(
            new Block("User2: Blockchain is amazing!", 
            Blockchain.blockchain.get(Blockchain.blockchain.size()-1).hash)
        );

        Blockchain.blockchain.add(
            new Block("User3: Decentralized social network prototype", 
            Blockchain.blockchain.get(Blockchain.blockchain.size()-1).hash)
        );

        System.out.println("Blockchain is Valid: " + Blockchain.isChainValid());

        // Tampering example
        Blockchain.blockchain.get(1).data = "Hacked Post";

        System.out.println("After Tampering...");
        System.out.println("Blockchain is Valid: " + Blockchain.isChainValid());
    }
}
