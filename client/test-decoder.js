try {
  const decoder = new TextDecoder('gbk');
  console.log("gbk works");
} catch (e) {
  console.error(e.message);
}
