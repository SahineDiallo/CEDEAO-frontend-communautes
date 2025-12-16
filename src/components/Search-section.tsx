import { Search } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Input } from "./ui/input"
import { Category } from '../types'
import { useState } from 'react'
import { Button } from './ui/Button'




// export function SearchSection({categories}: {categories: Category[]}) {
//   return (
//     <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
//       <div className="flex flex-col md:flex-row gap-4">
//         <div className="relative flex-1">
//           <Input
//             type="text"
//             placeholder="Search News"
//             className="pl-10"
//           />
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//         </div>
//         <Select>
//           <SelectTrigger className="w-full md:w-[200px]">
//             <SelectValue placeholder="All Types" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Types</SelectItem>
//             <SelectItem value="news">News</SelectItem>
//             <SelectItem value="articles">Articles</SelectItem>
//           </SelectContent>
//         </Select>
//         <Select>
//           <SelectTrigger className="w-full md:w-[200px]">
//             <SelectValue placeholder="All Categories" />
//           </SelectTrigger>
//           <SelectContent className='bg-white'>
//             <SelectItem value="all">All Categories</SelectItem>
//             {
//               categories.map(category => (
//                 <SelectItem value={category.nom}>{category.nom}</SelectItem>

//               ))
//             }
//           </SelectContent>
//         </Select>
//       </div>
//     </div>
//   )
// }


interface FilterValues {
  query: string;
  type: string;
  category: string;
}

interface ReusableFilterProps {
  categories: Category[];
  initialFilters?: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
}
export function ReusableFilter({ categories, initialFilters, onFilterChange }: ReusableFilterProps) {
  const [searchQuery, setSearchQuery] = useState(initialFilters?.query || '');
  const [newsType, setNewsType] = useState(initialFilters?.type || 'all');
  const [selectedCategory, setSelectedCategory] = useState(initialFilters?.category || 'all');

  const handleQueryChange = () => {
    onFilterChange({ query: searchQuery, type: newsType, category: selectedCategory });
  };

  const handleTypeChange = (value: string) => {
    setNewsType(value);
    onFilterChange({ query: searchQuery, type: value, category: selectedCategory });
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    onFilterChange({ query: searchQuery, type: newsType, category: value });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Recherche ...."
          className="pl-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
        <div className="absolute right-10 top-[15px] -translate-y-1/2 h-4 w-4 text-muted-foreground mr-2">
          <Button className='bg-primary text-white px-4 py-2' onClick={handleQueryChange}>
            <Search />
          </Button>
        </div>
      </div>
      <Select value={newsType} onValueChange={handleTypeChange}>
        <SelectTrigger className="w-full md:w-[300px]">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les types</SelectItem>
        </SelectContent>
      </Select>
      <Select value={selectedCategory} onValueChange={handleCategoryChange}>
        <SelectTrigger className="w-full md:w-[300px]">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="all">Toutes les Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.pkId || category.nom} value={category.nom}>
              {category.nom}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

