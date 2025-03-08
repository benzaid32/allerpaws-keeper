
import React from "react";
import { useFoodSearch } from "@/hooks/use-food-search";
import { useFoodComparison } from "@/hooks/use-food-comparison";
import { FoodProduct } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Search, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SearchTab: React.FC = () => {
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm, searchResults, loading, handleSearch } = useFoodSearch();
  const { addToComparison } = useFoodComparison();

  return (
    <div>
      {/* Search form */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search for pet food</Label>
            <div className="flex gap-2">
              <Input
                id="search"
                placeholder="Search by brand or product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Results */}
      <div>
        {searchResults.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Search Results</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {searchResults.map((product) => (
                <SearchResultCard 
                  key={product.id} 
                  product={product} 
                  onViewDetails={() => navigate(`/food/${product.id}`)}
                  onAddToComparison={() => addToComparison(product)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

interface SearchResultCardProps {
  product: FoodProduct;
  onViewDetails: () => void;
  onAddToComparison: () => void;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({ 
  product, 
  onViewDetails, 
  onAddToComparison 
}) => {
  return (
    <Card key={product.id} className="overflow-hidden">
      <div className="flex">
        {product.imageUrl && (
          <div className="w-24 h-24 flex-shrink-0">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-4 flex-1">
          <h3 className="font-medium">{product.name}</h3>
          <p className="text-sm text-muted-foreground">{product.brand}</p>
          {product.allergens && product.allergens.length > 0 && (
            <div className="mt-2">
              <span className="text-xs font-medium text-red-500">
                Common Allergens:
              </span>
              <span className="text-xs ml-1">
                {product.allergens.join(", ")}
              </span>
            </div>
          )}
          <div className="flex mt-2 space-x-2">
            <Button
              variant="link"
              className="p-0 h-auto text-xs"
              onClick={onViewDetails}
            >
              View Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={onAddToComparison}
            >
              <BarChart3 className="h-3 w-3 mr-1" />
              Compare
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SearchTab;
