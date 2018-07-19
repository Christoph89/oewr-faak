/*! OEWR - ctx/ctx-db.ts
* Copyright Christoph Schaunig 2018
*/

/// <reference path="ctx.ts" />
"use strict";

module $oewr.$ctx.db
{
  /** Specifies a database table. */
  export class DBTable<TRaw, T>
  {
    public name: string;
    public id: string;
    public parse: (obj: any) => T;
    public failLoadStatic: () => void;
    public staticRes: string;

    /** Initializes a new instance of DBTable. */
    public constructor(name: string, id: string, parse?: (obj: any) => T, staticRes?: string, failLoadStatic?: () => void)
    {
      this.name=name;
      this.id=id;
      this.parse=parse;
      this.staticRes=staticRes;
      this.failLoadStatic=failLoadStatic;
    }

    /** Starts a new query. */
    public q(): DBQuery<TRaw, T>
    { 
      return new DBQuery<TRaw, T>(this);
    }

    private set(method: string, item: TRaw): JQueryPromise<T>;
    private set(method: string, items: TRaw[]): JQueryPromise<T[]>;
    private set(method: string, arg: any): JQueryPromise<any>
    {
      var items: T[]=Array.isArray(arg)?arg:[arg];
      if (method=="post" && this.id) //remove id for insert
        $q(items).ForEach(x => delete x[this.id]);
      return $ctx[method]("/"+$cfg.ctx.db+"/_table/"+this.name, { resource: items }).then(res => 
      {
        if (res && res.resource && res.resource.length)
          $q(<T[]>res.resource).ForEach((x, i) => $.extend(items[i], x));
        return Array.isArray(arg)?$q(arg).Select(x => this.parse(x)).ToArray():this.parse(arg);
      });
    }

    public insert(item: TRaw): JQueryPromise<T>;
    public insert(items: TRaw[]): JQueryPromise<T[]>;
    public insert(arg: any): JQueryPromise<any>
    {
      return this.set("post", arg);
    }

    public update(item: TRaw): JQueryPromise<T>;
    public update(items: TRaw[]): JQueryPromise<T[]>;
    public update(arg: any): JQueryPromise<any>
    {
      return this.set("put", arg);
    }

    public delete(item: TRaw): JQueryPromise<T>;
    public delete(items: TRaw[]): JQueryPromise<T[]>;
    public delete(arg: any): JQueryPromise<any>
    {
      return this.set("del", arg);
    }
  }

  /** Specifies a database call. */
  export class DBQuery<TRaw, T>
  {
    private _table: DBTable<TRaw, T>;
    private _url: string;
    private _select: string;
    private _where: string;
    private _orderBy: string;
    private _groupBy: string;
    private _limit: number;
    private _offset: number;
    private _related: string;

    /** Initializes a new instance of DBCall. */
    public constructor(table: DBTable<TRaw, T>)
    {
      this._table=table;
      this._url="/"+$cfg.ctx.db+"/_table/"+table.name;
    }

    /** Selects the specified fields. */
    public select(fields: string): DBQuery<TRaw, T>
    {
      this._select=fields;
      return this;
    }

    /** Specifies a filter. */
    public where(filter: string): DBQuery<TRaw, T>
    {
      this._where=filter;
      return this;
    }

    /** Specifies a relation. */
    public related(fields: string): DBQuery<TRaw, T>
    {
      this._related=fields;
      return this;
    }

    /** Specifies to order the result by the given fields. */
    public orderBy(fields: string): DBQuery<TRaw, T>
    {
      this._orderBy=fields;
      return this;
    }

    /** Specifies to group the result by the fiven fields. */
    public groupBy(fields: string): DBQuery<TRaw, T>
    {
      this._groupBy=fields;
      return this;
    }

    /** Limits the amount of records returned. */
    public limit(limit: number): DBQuery<TRaw, T>
    {
      this._limit=limit;
      return this;
    }

    /** Specifies an offset for the result records. */
    public offset(offset: number): DBQuery<TRaw, T>
    {
      this._offset=offset;
      return this;
    }

    /** Parses a single record. */
    private parseSingle(res): T
    {
      if (!res) return null;
      else if (this._table.parse) return this._table.parse(res);
      else return <T>res;
    }

    /** Parses multiple records. */
    private parseMany(res): T[]
    {
      if (!res || !res.resource)
        return [];
      if (this._table.parse) return $q(<T[]>res.resource).Select(x => this._table.parse(x)).ToArray();
      else return <T[]>res.resource;
    }

    /** Retrieves a single records. */
    public get(id: string): JQueryPromise<T>
    {
      var data={};
      if (this._select) data["fields"]=this._select;
      return get(this._url+"/"+id, data).then(res => this.parseSingle(res));
    }

    /** Retrieves multiple records. */
    public find(): JQueryPromise<T[]>
    {
      var data={};
      if (this._select) data["fields"]=this._select;
      if (this._where) data["filter"]=this._where;
      if (this._orderBy) data["order"]=this._orderBy;
      if (this._groupBy) data["group"]=this._groupBy;
      if (this._limit) data["limit"]=this._limit;
      if (this._offset) data["offset"]=this._offset;
      if (this._related) data["related"]=this._related;
      return get(this._url, data).then(
        res => this.parseMany(res), // success
        () => // fail
        {
          // retry from static resource
          if (this._table.staticRes)
          {
            console.debug("Failed to load "+this._table.name+" from service, try using static resource.");
            if (this._table.failLoadStatic) this._table.failLoadStatic();
            return this.retryStatic(this._table.staticRes).then(res => this.parseMany(res));
          }
        });
    }

    private retryStatic(res): JQueryPromise<any>
    {
      return $.ajax({
        type: "GET",
        url: $cfg.root+res,
        accepts: { json: "application/json" },
        contentType: "application/json",
      });
    }
  }

  // init tables
  export var event=new DBTable<IMTBEvent, MTBEvent>("event", "eventId", ev => new MTBEvent(ev), "data/events.json", () => { $cfg.allow_reg=false; });
}