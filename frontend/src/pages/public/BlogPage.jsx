import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Clock, User, Calendar } from 'lucide-react';
import api from '../../api/client';
import { Skeleton } from '../../components/common/Skeleton';
import { formatDate } from '../../utils/format';

export const BlogPage = () => {
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await api.get('/cms/blog?limit=12');
        if (res.success && res.data) {
          setPosts(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-widest text-emerald-800 font-bold block mb-1">
          The Dhansiri Journal
        </span>
        <h1 className="font-serif-display text-3xl sm:text-4xl font-semibold text-slate-900 mb-3">
          Agronomy & Culinary Insights
        </h1>
        <p className="text-sm text-[#71717A] font-light">
          Articles on Bengali paddy cultivars, milling moisture engineering, and culinary masterclasses from heritage chefs.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-16/9 w-full" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post._id} className="bg-white border border-slate-200 rounded-xs overflow-hidden flex flex-col hover:border-[#9F7E3B] transition-colors">
              <Link to={`/blog/${post.slug}`} className="aspect-16/9 overflow-hidden bg-slate-50 block">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </Link>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-[#71717A] mb-2">
                    <span className="uppercase tracking-wider font-semibold text-emerald-800">{post.category}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.readTimeMinutes} min
                    </span>
                  </div>
                  <Link to={`/blog/${post.slug}`}>
                    <h2 className="font-serif-display text-base font-semibold text-slate-900 hover:text-emerald-800 transition-colors mb-2 line-clamp-2">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-xs text-[#52525B] line-clamp-3 font-light mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#F0ECE1] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#71717A]">{formatDate(post.publishedAt)}</span>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="font-bold text-slate-900 hover:text-emerald-800 inline-flex items-center gap-1"
                  >
                    Read <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
