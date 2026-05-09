import NextAuth from "next-auth"
import DiscordProvider from "next-auth/providers/discord"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "discord" && account.access_token) {
        // Fetch user's guilds to verify MIAI membership
        try {
          const res = await fetch("https://discord.com/api/users/@me/guilds", {
            headers: {
              Authorization: `Bearer ${account.access_token}`,
            },
          });
          if (res.ok) {
            const guilds = await res.json();
            // Assuming MIAI Discord Server ID is provided in env
            const miaiGuildId = process.env.MIAI_DISCORD_GUILD_ID;
            if (miaiGuildId) {
              const isMember = guilds.some((g: any) => g.id === miaiGuildId);
              if (!isMember) {
                return false; // Deny sign in
              }
            }
          }
        } catch (error) {
          console.error("Error fetching Discord guilds:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, profile, account }) {
      if (profile) {
        token.discordId = profile.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.discordId = token.discordId;
      }
      return session;
    },
  },
})
