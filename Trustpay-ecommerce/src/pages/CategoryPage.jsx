const CategoryPage = ({ category }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const loadCategory = async () => {
            setLoading(true);
            try {
                const { data } = await fetchByCategory(category);
                setItems(data);
            } catch (error) {
                console.error("Failed to load category:", error);
            } finally {
                setLoading(false);
            }
        };
        loadCategory();
    }, [category]);

    if (loading) return <div>Loading listings...</div>;
    if (items.length === 0) return <div>No products found in {category}.</div>;

    return (
        <div className="product-grid">
            {items.map((item) => (
                <div key={item._id} className="product-card">
                    <h3>{item.title}</h3>
                    {/* Add image and price here */}
                </div>
            ))}
        </div>
    );
};