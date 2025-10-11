export default {
  base: "/oldmaps/",
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        main:'index.html',
        low_level_flights: 'low_level_flights/index.html'
      }
    }
  }
}
