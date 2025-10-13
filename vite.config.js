export default {
  base: "/old-maps-demo/",
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        main:'index.html',
        low_level_flights: 'low_level_flights/index.html',
        lost_markets: 'lost_markets/index.html'
      }
    }
  }
}
