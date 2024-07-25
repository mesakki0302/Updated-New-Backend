// Function to simulate an asynchronous operation
function asyncOperation() {
    console.log('Start of async operation');

    // Schedule a task to run asynchronously after 2 seconds
    setTimeout(() => {
        console.log('Async operation completed');
    }, 5000);

    console.log('End of async operation');
}

// Call the asyncOperation function
asyncOperation();

console.log('Outside of async operation');
