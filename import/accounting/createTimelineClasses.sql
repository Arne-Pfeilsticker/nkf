create class Timeline extends V;
create property Timeline.bookingYear short;
alter property Timeline.bookingYear MANDATORY=true;
alter property Timeline.bookingYear NOTNULL=true;
create class toBookingYear extends E;
create class toPerson extends E;