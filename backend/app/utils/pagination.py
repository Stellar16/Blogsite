def paginate(query, page:int, page_size:int):
total = query.count()
items = query.offset((page-1)*page_size).limit(page_size).all()
return {
"page": page,
"page_size": page_size,
"total": total,
"pages": (total + page_size - 1)//page_size,
"items": items,
}