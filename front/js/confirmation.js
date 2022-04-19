const url = new URL(window.location.href);
document.querySelector('#orderId').textContent = url.searchParams.get("orderId")