import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Links</h2>
          
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">📊 Start Mapping</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/map/shopify-products" className="text-blue-600 hover:underline flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" />
                    Shopify Products Mapper
                  </Link>
                </li>
                <li>
                  <Link href="/map/shopify-inventory" className="text-blue-600 hover:underline flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" />
                    Shopify Inventory Mapper
                  </Link>
                </li>
                <li>
                  <Link href="/map/stripe-customers" className="text-blue-600 hover:underline flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" />
                    Stripe Customers Mapper
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-3">📚 Documentation</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/docs/shopify-products-csv-mapper" className="text-blue-600 hover:underline flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" />
                    Shopify Products Guide
                  </Link>
                </li>
                <li>
                  <Link href="/docs/shopify-inventory-csv-mapper" className="text-blue-600 hover:underline flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" />
                    Shopify Inventory Guide
                  </Link>
                </li>
                <li>
                  <Link href="/docs/stripe-customers-csv-mapper" className="text-blue-600 hover:underline flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" />
                    Stripe Customers Guide
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center gap-4">
          <Link 
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Go to Homepage
          </Link>
          <Link 
            href="/docs"
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            View All Docs
          </Link>
        </div>
      </div>
    </div>
  );
}