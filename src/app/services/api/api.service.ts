import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from 'src/environments/environment'

const headers = new HttpHeaders().set(
  'Content-Type',
  'application/json; charset=utf-8'
)

export interface AllAuctionsForTokenResponse {
  data: {
    auctions: {
      id: number
      end_timestamp: string
      seller: {
        address: string
      }
      status: string
      bids: {
        id: string
        bid_amount: string
        bidder_id: string
        timestamp: string
      }[]
      bid_count: number
      ask_price: number
    }[]
  }
}

export interface Result {
  consumed_gas: number
  storage_size: number
  paid_storage_size_diff?: number
}

export interface Child4 {
  prim: string
  type: string
  name: string
  value: string
}

export interface Child3 {
  prim: string
  type: string
  children: Child4[]
}

export interface Child2 {
  prim: string
  type: string
  value: string
  name: string
  children: Child3[]
}

export interface Child {
  prim: string
  type: string
  name: string
  value: string
  children: Child2[]
}

export interface Parameters {
  prim: string
  type: string
  value: string
  children: Child[]
  name: string
}

export interface Child6 {
  prim: string
  type: string
  name: string
  value: any
  from: string
  diff_type: string
}

export interface Child5 {
  prim: string
  type: string
  name: string
  children: Child6[]
  value: any
  diff_type: string
}

export interface StorageDiff {
  prim: string
  type: string
  children: Child5[]
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private readonly http: HttpClient) {}

  public getAllAuctionsForToken(tokenId: number) {
    return this.http
      .post<AllAuctionsForTokenResponse>(environment.dipdupUrl, {
        query: `
        {
          auctions(order_by: {end_timestamp: desc} where: {token_id: {_eq: ${tokenId}}}) {
            id
            end_timestamp
            seller {
              address
            }
            status
            bids(order_by: {timestamp: desc}) {
              id
              bid_amount
              bidder_id
              timestamp
            }
            bid_amount
            bid_count
            ask_price
          }
        }
              `,
      })
      .toPromise()
  }

  public getBidsForAuction(auctionId: number) {
    return this.http
      .post<{
        data: {
          auctions: {
            id: number
            end_timestamp: string
            bids: {
              id: string
              bid_amount: string
              bidder_id: string
              timestamp: string
            }[]
            bid_count: number
          }[]
        }
      }>(environment.dipdupUrl, {
        query: `
        {
          auctions(where: {id: {_eq: ${auctionId}}}) {
            id
            end_timestamp
            seller {
              address
            }
            status
            bids(order_by: {timestamp: desc}) {
              id
              bid_amount
              bidder_id
              timestamp
            }
            bid_count
          }
        }
              `,
      })
      .toPromise()
  }

  public getOperationCount(entrypoint?: string) {
    const params = entrypoint ? `?entrypoint=${entrypoint}` : ``
    return this.http
      .get<number>(`${environment.indexerUrl}auction/operations/count${params}`)
      .toPromise()
  }

  public getSum(field?: string) {
    const params = field ? `?aggregate=${field}` : ``
    return this.http
      .get<number>(`${environment.indexerUrl}auction/operations/sum${params}`)
      .toPromise()
  }

  public getLatestOperations(limit: number) {
    return this.http
      .post<{
        data: {
          activity: {
            auction: {
              id: number
              token_id: number
              end_timestamp: string
            }
            created: string
            sender: string
            tez_amount: number
            event: 'CREATE_AUCTION' | 'BID' | 'WITHDRAW'
          }[]
        }
      }>(environment.dipdupUrl, {
        query: `
        {
          activity(limit: ${limit} order_by: {created: desc}) {
            operation_hash
            auction {
              id
              token_id
              end_timestamp
            }
            created
            sender
            tez_amount
            event
          }
        }
              `,
      })
      .toPromise()
  }

  getAllHolders() {
    return this.http
      .post<{
        data: {
          tokens: {
            id: number
            holder: {
              address: string
            }
            last_bid_amount: number
            auction_infos: {
              auction: {
                id: number
                end_timestamp: string
                seller: {
                  address: string
                }
                bidder: {
                  address: string
                }
                bid_count: number
                bid_amount: number
                token_id: number
                status: number
                ask_price: number
              }
            }[]
          }[]
        }
      }>(environment.dipdupUrl, {
        query: `
        {
          tokens {
            id
            holder {
              address
            }
            last_bid_amount
            auction_infos { 
              auction {
                id
                end_timestamp
                seller {
                  address
                }
                bidder {
                  address
                }
                bid_count
                bid_amount
                token_id
                status
                ask_price
              }
            }
          }
        }
        `,
      })
      .toPromise()
  }

  getAllAuctions() {
    return this.http
      .post<{
        data: {
          auctions: {
            id: number
            end_timestamp: string
            seller: {
              address: string
            }
            bidder: {
              address: string
            }
            bid_amount: number
            status: number
            token_id: number
          }[]
        }
      }>(environment.dipdupUrl, {
        query: `
        {
          auctions(order_by: {end_timestamp: desc}) {
            id
            end_timestamp
            seller {
              address
            }
            bidder {
              address
            }
            bid_amount
            token_id
            status
          }
        }
                `,
      })
      .toPromise()
  }
}
