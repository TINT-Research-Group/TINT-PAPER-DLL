---
---
$(function() {
  var deadlineTypes = {
    abstract: { label: 'Abstract' },
    full_paper: { label: 'Full Paper' },
    first_round_decision: { label: 'First-round Decision' }
  };
  var conferenceDates = {};
  var deadlineByConf = {};

  {% for conf in site.data.conferences %}
  {% assign num_deadlines = conf.deadline.size %}
  {% if num_deadlines == 0 %}
    {% assign num_deadlines = 1 %}
  {% endif %}
  {% assign range_end = num_deadlines | minus: 1 %}
  {% for i in (0..range_end) %}
  {% assign conf_id = conf.name | append: conf.year | append: '-' | append: i | slugify %}
  conferenceDates["{{ conf_id }}"] = {
    round: {{ i | plus: 1 }},
    roundCount: {{ num_deadlines }},
    timezone: {{ conf.timezone | default: 'Etc/GMT+12' | jsonify }},
    abstract: {{ conf.abstract_deadline[i] | jsonify }},
    full_paper: {{ conf.full_paper_deadline[i] | jsonify }},
    first_round_decision: {{ conf.first_round_decision[i] | jsonify }}
  };
  {% endfor %}
  {% endfor %}

  var confs = $('.conf');
  var dateTypeStoreKey = '{{ site.domain }}-deadline-type';
  var selectedDeadlineType = store.get(dateTypeStoreKey);
  if (!deadlineTypes[selectedDeadlineType]) {
    selectedDeadlineType = 'abstract';
  }

  function parseConferenceDate(rawDate, timezone) {
    if (!rawDate || rawDate === 'TBA' || rawDate === 'N/A') {
      return null;
    }

    var parsed = moment.tz(rawDate, timezone || 'Etc/GMT+12');
    return parsed.isValid() ? parsed : null;
  }

  function stopCountdown(timer) {
    try {
      timer.countdown('remove');
    } catch (_) {
      // The element has no active countdown yet.
    }
    timer.empty();
  }

  function makeUpdateCountdown(confDeadline) {
    return function(event) {
      if (moment().diff(confDeadline) <= 0) {
        $(this).html(event.strftime('%D days %Hh %Mm %Ss'));
      } else {
        $(this).html(confDeadline.fromNow());
      }
    };
  }

  function reorderConferences() {
    var now = moment();
    var ordered = confs.detach().sort(function(a, b) {
      var aDeadline = deadlineByConf[a.id];
      var bDeadline = deadlineByConf[b.id];

      if (!aDeadline && !bDeadline) return 0;
      if (!aDeadline) return 1;
      if (!bDeadline) return -1;

      var aPast = now.diff(aDeadline) > 0;
      var bPast = now.diff(bDeadline) > 0;
      if (aPast !== bPast) return aPast ? 1 : -1;

      if (aPast) return bDeadline.valueOf() - aDeadline.valueOf();
      return aDeadline.valueOf() - bDeadline.valueOf();
    });

    $('.conf-container').append(ordered);
  }

  function renderDeadlineType(deadlineType) {
    selectedDeadlineType = deadlineType;
    deadlineByConf = {};

    confs.each(function(_, element) {
      var conf = $(element);
      var data = conferenceDates[element.id];
      var rawDate = data ? data[deadlineType] : null;
      var displayValue = rawDate || 'TBA';
      var timer = conf.find('.timer');
      var deadline = parseConferenceDate(rawDate, data && data.timezone);
      var label = deadlineTypes[deadlineType].label;

      stopCountdown(timer);
      conf.removeClass('past');

      if (data && data.roundCount >= 2) {
        label += ' (' + data.round + ' / ' + data.roundCount + ')';
      }
      conf.find('.deadline-label').text(label + ':');

      if (deadline) {
        timer.countdown(deadline.toDate(), makeUpdateCountdown(deadline));
        conf.find('.deadline-time').text(deadline.local().format('D MMM YYYY, h:mm:ss a'));
        deadlineByConf[element.id] = deadline;

        if (moment().diff(deadline) > 0) {
          conf.addClass('past');
        }
      } else {
        timer.text(displayValue);
        conf.find('.deadline-time').text(displayValue);
        deadlineByConf[element.id] = null;
      }
    });

    $('.deadline-type-toggle')
      .removeClass('active')
      .attr('aria-pressed', 'false')
      .filter('[data-deadline-type="' + deadlineType + '"]')
      .addClass('active')
      .attr('aria-pressed', 'true');

    store.set(dateTypeStoreKey, deadlineType);
    reorderConferences();
  }

  $('.deadline-type-toggle').on('click', function() {
    renderDeadlineType($(this).data('deadline-type'));
    updateConfList();
  });

  // Set conference tag checkboxes.
  var confTypeData = {{ site.data.types | jsonify }};
  var allTags = [];
  var toggleStatus = {};
  for (var i = 0; i < confTypeData.length; i++) {
    allTags[i] = confTypeData[i].tag;
    toggleStatus[allTags[i]] = false;
  }

  var tags = store.get('{{ site.domain }}');
  if (tags === undefined) {
    tags = allTags;
  }
  for (var j = 0; j < tags.length; j++) {
    $('#' + tags[j] + '-checkbox').prop('checked', false);
    toggleStatus[tags[j]] = false;
  }
  store.set('{{ site.domain }}', tags);

  function updateConfList() {
    confs.each(function(_, element) {
      var conf = $(element);
      var selectedTagMatches = [];
      for (var i = 0; i < allTags.length; i++) {
        if (toggleStatus[allTags[i]]) {
          selectedTagMatches.push(conf.hasClass(allTags[i]));
        }
      }

      if (selectedTagMatches.every(Boolean)) {
        conf.show();
      } else {
        conf.hide();
      }
    });
  }

  $('form :checkbox').change(function() {
    var checked = $(this).is(':checked');
    var tag = $(this).prop('id').slice(0, -9);
    toggleStatus[tag] = checked;

    if (checked) {
      if (tags.indexOf(tag) < 0) tags.push(tag);
    } else {
      var index = tags.indexOf(tag);
      if (index >= 0) tags.splice(index, 1);
    }

    store.set('{{ site.domain }}', tags);
    updateConfList();
  });

  renderDeadlineType(selectedDeadlineType);
  updateConfList();
});
