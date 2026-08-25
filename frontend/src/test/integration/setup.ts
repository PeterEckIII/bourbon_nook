import '@testing-library/jest-dom';

// jsdom doesn't implement the native <dialog> API, so tests using
// showModal()/close() (e.g. DeleteAccountDialog) crash without this.
HTMLDialogElement.prototype.showModal = function () {
  this.setAttribute('open', '');
};
HTMLDialogElement.prototype.close = function () {
  this.removeAttribute('open');
};

// jsdom doesn't implement ResizeObserver, which recharts' ResponsiveContainer
// requires to measure its container.
class ResizeObserverMock implements ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverMock;
