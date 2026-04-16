'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { MapPin, Search, X, Loader2, Map } from 'lucide-react'
import { lookupPostcode, PostcodeResult } from '@/lib/postcodeLookup'

interface VenueSearchProps {
  value: string
  onChange: (value: string) => void
}

// Pre-populated common football venues in the UK
const COMMON_VENUES = [
  'Bramley Lane Park',
  'Castleford Sports Ground',
  'Central Park',
  'Chapeltown United FC',
  'Crown Park',
  'Farsley Celtic FC',
  'Garforth Town FC',
  'Guiseley FC',
  'Halfords Lane',
  'Horsforth Fairway',
  'Kirkstall Forge',
  'Lane End Road',
  'Meanwood Park',
  'Mill Lane',
  'Morley Town FC',
  'Oulton Hall',
  'Pudsey Cricket Club',
  'Rawdon Billiard Hall',
  'Redcote Lane',
  'Rodley FC',
  'Seacroft Green',
  'Stanningley Park',
  'Temple Newsam',
  'The Crescent',
  'Thorp Arch',
  'Tinshill Rec',
  'Totley Grove',
  'Weetwood Playing Fields',
  'Whitkirk Lane',
  'Yorkshire Payments Arena',
]

// Postcode regex: UK postcode format
const POSTCODE_REGEX = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/i

interface SearchResult {
  type: 'venue' | 'postcode'
  value: string
  label: string
  sublabel?: string
  data?: PostcodeResult
}

export function VenueSearch({ value, onChange }: VenueSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [recentVenues, setRecentVenues] = useState<string[]>([])
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout>()

  // Load recent venues from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentVenues')
    if (stored) {
      setRecentVenues(JSON.parse(stored))
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const saveVenueToRecent = (venue: string) => {
    const updated = [venue, ...recentVenues.filter(v => v !== venue)].slice(0, 10)
    setRecentVenues(updated)
    localStorage.setItem('recentVenues', JSON.stringify(updated))
  }

  // Search logic with debounce
  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSearchResults([])
      return
    }

    const isPostcode = POSTCODE_REGEX.test(searchQuery)
    const results: SearchResult[] = []

    // Filter venues
    const venueMatches = COMMON_VENUES.filter(v =>
      v.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5)

    results.push(...venueMatches.map(v => ({
      type: 'venue' as const,
      value: v,
      label: v,
    })))

    // Postcode lookup
    if (isPostcode) {
      setIsLoading(true)
      try {
        const postcodeResult = await lookupPostcode(searchQuery)
        if (postcodeResult) {
          results.unshift({
            type: 'postcode',
            value: postcodeResult.postcode,
            label: postcodeResult.postcode,
            sublabel: postcodeResult.formattedAddress,
            data: postcodeResult,
          })
        }
      } catch (error) {
        console.error('Postcode lookup error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    setSearchResults(results)
  }, [])

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    onChange(newQuery)

    // Debounce search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(newQuery)
    }, 300)
  }

  const handleSelect = (result: SearchResult) => {
    onChange(result.value)
    saveVenueToRecent(result.value)
    setQuery('')
    setSearchResults([])
    setIsOpen(false)
    inputRef.current?.blur()
  }

  const handleClear = () => {
    onChange('')
    setQuery('')
    setSearchResults([])
    inputRef.current?.focus()
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query || value}
          onChange={handleQueryChange}
          onFocus={() => setIsOpen(true)}
          placeholder="Search venue name or postcode (e.g. GU21 8TL)"
          className="input-field pl-10 pr-10"
        />
        {isLoading && (
          <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 h-5 w-5 text-cyan-400 animate-spin" />
        )}
        {value && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-stadium-900 border-2 border-cyan-500/30 clip-corner-sm shadow-2xl max-h-96 overflow-auto"
        >
          {/* Postcode Search Result */}
          {query.length >= 2 && searchResults.some(r => r.type === 'postcode') && (
            <div className="p-3 border-b border-stadium-700/50">
              <p className="text-xs font-black text-cyan-400/70 uppercase tracking-widest mb-2">
                Postcode Lookup
              </p>
              <div className="space-y-1">
                {searchResults.filter(r => r.type === 'postcode').map((result) => (
                  <button
                    key={result.value}
                    type="button"
                    onClick={() => handleSelect(result)}
                    className="w-full flex items-center space-x-3 p-3 text-left bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 clip-corner-sm transition-colors"
                  >
                    <Map className="h-5 w-5 text-cyan-400" />
                    <div>
                      <p className="font-bold text-white">{result.label}</p>
                      {result.sublabel && (
                        <p className="text-sm text-gray-400">{result.sublabel}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Venue Matches */}
          {query.length >= 2 && searchResults.some(r => r.type === 'venue') && (
            <div className="p-3 border-b border-stadium-700/50">
              <p className="text-xs font-black text-cyan-400/70 uppercase tracking-widest mb-2">
                Venues
              </p>
              <div className="space-y-1">
                {searchResults.filter(r => r.type === 'venue').map((result) => (
                  <button
                    key={result.value}
                    type="button"
                    onClick={() => handleSelect(result)}
                    className="w-full flex items-center space-x-3 p-2 text-left text-white hover:bg-cyan-500/10 transition-colors clip-corner-sm"
                  >
                    <MapPin className="h-4 w-4 text-cyan-400/50" />
                    <span className="text-sm">{result.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recent Venues */}
          {query.length === 0 && recentVenues.length > 0 && (
            <div className="p-3 border-b border-stadium-700/50">
              <p className="text-xs font-black text-cyan-400/70 uppercase tracking-widest mb-2">
                Recent
              </p>
              <div className="space-y-1">
                {recentVenues.map((venue) => (
                  <button
                    key={venue}
                    type="button"
                    onClick={() => handleSelect({ type: 'venue', value: venue, label: venue })}
                    className="w-full flex items-center space-x-3 p-2 text-left text-white hover:bg-cyan-500/10 transition-colors clip-corner-sm"
                  >
                    <MapPin className="h-4 w-4 text-cyan-400/50" />
                    <span className="text-sm">{venue}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Venues (when no query) */}
          {query.length === 0 && (
            <div className="p-4">
              <p className="text-xs font-black text-cyan-400/70 uppercase tracking-widest mb-3">
                Popular Venues
              </p>
              <div className="grid grid-cols-2 gap-2">
                {COMMON_VENUES.slice(0, 12).map((venue) => (
                  <button
                    key={venue}
                    type="button"
                    onClick={() => handleSelect({ type: 'venue', value: venue, label: venue })}
                    className="flex items-center space-x-2 p-2 text-left text-sm text-gray-400 hover:text-white hover:bg-cyan-500/10 transition-colors clip-corner-sm"
                  >
                    <MapPin className="h-3 w-3 text-cyan-400/50 flex-shrink-0" />
                    <span className="truncate">{venue}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {query.length >= 2 && searchResults.length === 0 && !isLoading && (
            <div className="p-6 text-center">
              <p className="text-gray-500 text-sm">No results found</p>
              <p className="text-gray-600 text-xs mt-1">Try a different postcode or enter a venue name</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}