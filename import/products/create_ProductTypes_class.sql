create class ProductTypes extends V;
create property ProductTypes.id string;
create property ProductTypes.parent_id string;
create property ProductTypes.label string;
alter property ProductTypes.id MANDATORY=true;
alter property ProductTypes.label MANDATORY=true;