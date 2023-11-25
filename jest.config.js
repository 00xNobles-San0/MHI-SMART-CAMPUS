export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/src'],
    moduleNameMapper: {
      '\\.(css|less|scss)$': 'identity-obj-proxy',
    },
  
}