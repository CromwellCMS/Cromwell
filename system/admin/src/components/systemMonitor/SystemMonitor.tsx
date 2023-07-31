import { TSystemUsage } from '@cromwell/core';
import { getRestApiClient } from '@cromwell/core-frontend';
import prettyBytes from 'pretty-bytes';
import React from 'react';

import LoadBox from '../../components/loadBox/LoadBox';
import commonStyles from '../../styles/common.module.scss';
import Modal from '../modal/Modal';
import { getCpuUsageOption, getPieOption } from './chartOptions';
import styles from './SystemMonitor.module.scss';

export default class SystemMonitor extends React.Component<
  {
    open: boolean;
    onClose: () => any;
  },
  {
    system?: TSystemUsage;
  }
> {
  private echarts;
  private cpuUsageChart;
  private ramUsageChart;
  private diskUsageChart;

  componentDidMount() {
    if (this.props.open) this.onOpen();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.open && this.props.open) this.onOpen();
  }

  private onOpen = async () => {
    if (!this.echarts) {
      const echarts = await import('echarts');
      this.echarts = echarts;
    }

    await this.getSystemUsage();

    if (this.props.open) {
      this.cpuUsageChart = this.echarts.init(document.getElementById('cpuUsageChart'));
      this.ramUsageChart = this.echarts.init(document.getElementById('ramUsageChart'));
      this.diskUsageChart = this.echarts.init(document.getElementById('diskUsageChart'));

      this.cpuUsageChart.setOption(getCpuUsageOption(this.echarts, this.state?.system?.cpuUsage?.previousLoads ?? []));

      this.ramUsageChart.setOption(
        getPieOption(
          'RAM',
          this.state?.system?.memoryUsage?.available ?? 0,
          this.state?.system?.memoryUsage?.used ?? 0,
        ),
      );

      this.diskUsageChart.setOption(
        getPieOption('Disk', this.state?.system?.diskUsage?.available ?? 0, this.state?.system?.diskUsage?.used ?? 0),
      );
    }
  };

  private getSystemUsage = async () => {
    try {
      const system = await getRestApiClient()?.getSystemUsage();
      this.setState({ system });
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    return (
      <Modal open={this.props.open} blurSelector="#root" className={commonStyles.center} onClose={this.props.onClose}>
        <div className={styles.SystemMonitor}>
          <h4 className={styles.infoHeader}>System specs</h4>
          {!this.state?.system && <LoadBox size={40} />}
          {this.state?.system && (
            <div className={styles.specsList}>
              <p>
                <b>OS:</b> {this.state?.system?.osInfo?.distro ?? ''} {this.state?.system?.osInfo?.arch ?? ''}
              </p>
              <p>
                <b>CPU:</b> {this.state?.system?.cpuInfo?.manufacturer ?? ''} {this.state?.system?.cpuInfo?.brand ?? ''}
              </p>
              <p>
                <b>RAM:</b> {prettyBytes(this.state?.system?.memoryUsage?.total ?? 0)}
              </p>
              <p>
                <b>Disk:</b> {prettyBytes(this.state?.system?.diskUsage?.size ?? 0)}
              </p>
            </div>
          )}

          <h4 className={styles.infoHeader}>CPU usage</h4>
          <div className={styles.chartBox}>
            {!this.state?.system && <LoadBox size={40} />}
            <div id="cpuUsageChart" className={styles.chart}></div>
          </div>

          <h4 className={styles.infoHeader}>RAM usage</h4>
          <div className={styles.chartBox}>
            {!this.state?.system && <LoadBox size={40} />}
            <div id="ramUsageChart" className={styles.chart}></div>
          </div>

          <h4 className={styles.infoHeader}>Disk usage</h4>
          <div className={styles.chartBox}>
            {!this.state?.system && <LoadBox size={40} />}
            <div id="diskUsageChart" className={styles.chart}></div>
          </div>
        </div>
      </Modal>
    );
  }
}
