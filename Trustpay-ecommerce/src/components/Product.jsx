export default function Product({ product }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p><strong>Price: ${product.price}</strong></p>
      <p>Stock: {product.countInStock}</p>
    </div>
  );
}