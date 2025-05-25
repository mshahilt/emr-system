// import { defineConfig } from 'vite'
// export default defineConfig({
  //   plugins: [
    //     tailwindcss(),
    //   ],
    // })
    
    import { defineConfig } from "vite";
    import { VitePWA } from "vite-plugin-pwa";
    import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true, // Enable service worker in development mode
      },
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "Doctor Dashboard",
        short_name: "DocDash",
        description:
          "A dashboard for doctors to manage appointments and patient history",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "main_icon.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "main_icon.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "main_icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
      },
    }),
  ],
});